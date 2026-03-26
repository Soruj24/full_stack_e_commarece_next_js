import { auth } from "@/auth";
import { dbConnect } from "@/config/db";
import { User } from "@/models/User";
import { Notification } from "@/models/Notification";
import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    if (!mongoose.Types.ObjectId.isValid(session.user.id)) {
      return NextResponse.json({ error: "Invalid session ID" }, { status: 400 });
    }

    const user = await User.findById(session.user.id).select("+password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Generate referral code if it doesn't exist
    if (!user.referralCode) {
      user.referralCode = `UM-${user._id.toString().slice(-6).toUpperCase()}-${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
      await user.save();
    }

    // Ensure preferences has default values if missing in DB
    const preferences = user.preferences || {
      emailNotifications: true,
      marketingEmails: false,
    };

    return NextResponse.json({ 
      success: true, 
      user: {
        ...user.toObject(),
        preferences,
        hasPassword: !!user.password
      }
    });
  } catch  {
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, image, preferences, bio, location, phoneNumber, website, designation, socialLinks, addresses, paymentMethods } = await request.json();

    await dbConnect();

    // Validate if session.user.id is a valid MongoDB ObjectId to avoid CastError
    if (!mongoose.Types.ObjectId.isValid(session.user.id)) {
      return NextResponse.json({ error: "Invalid session ID. Please re-login." }, { status: 400 });
    }

    const updateData: Record<string, unknown> = {};
    if (name) updateData.name = name;
    if (image) updateData.image = image;
    if (bio !== undefined) updateData.bio = bio;
    if (location !== undefined) updateData.location = location;
    if (phoneNumber !== undefined) updateData.phoneNumber = phoneNumber;
    if (website !== undefined) updateData.website = website;
    if (designation !== undefined) updateData.designation = designation;
    if (addresses !== undefined) updateData.addresses = addresses;
    if (paymentMethods !== undefined) updateData.paymentMethods = paymentMethods;
    
    if (socialLinks !== undefined) {
      if (socialLinks.twitter !== undefined) updateData['socialLinks.twitter'] = socialLinks.twitter;
      if (socialLinks.linkedin !== undefined) updateData['socialLinks.linkedin'] = socialLinks.linkedin;
      if (socialLinks.github !== undefined) updateData['socialLinks.github'] = socialLinks.github;
      if (socialLinks.facebook !== undefined) updateData['socialLinks.facebook'] = socialLinks.facebook;
    }
    
    if (preferences) {
      if (typeof preferences.emailNotifications !== 'undefined') {
        updateData['preferences.emailNotifications'] = preferences.emailNotifications;
      }
      if (typeof preferences.marketingEmails !== 'undefined') {
        updateData['preferences.marketingEmails'] = preferences.marketingEmails;
      }
      if (typeof preferences.smsNotifications !== 'undefined') {
        updateData['preferences.smsNotifications'] = preferences.smsNotifications;
      }
      if (typeof preferences.inAppNotifications !== 'undefined') {
        updateData['preferences.inAppNotifications'] = preferences.inAppNotifications;
      }
    }

    const user = await User.findByIdAndUpdate(
      session.user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create notification only if name or image changed
    if (name || image) {
      await Notification.create({
        userId: user._id,
        title: "Profile Updated",
        message: "Your profile information has been successfully updated.",
        type: "success",
      });
    }

    return NextResponse.json({
      success: true,
      user: {
        name: user.name,
        email: user.email,
        image: user.image,
        role: user.role,
        preferences: user.preferences || {
          emailNotifications: true,
          marketingEmails: false,
        },
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
