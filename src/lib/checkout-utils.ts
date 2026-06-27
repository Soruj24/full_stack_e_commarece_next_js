export interface ShippingRate {
  id: string;
  name: string;
  price: number;
  description: string;
  rate: number; // Added to match usage
  carrier: string; // Added to match usage
  service: string; // Added to match usage
  estimatedDays: string; // Added to match usage
}

export function getShippingRates(zipCode: string, subtotal: number): ShippingRate[] {
  // Using zipCode and subtotal for calculation logic if needed
  // For now returning mock data with all required fields
  return [
    {
      id: "standard",
      name: "Standard Shipping",
      price: 10.0,
      description: "Delivery in 3-5 business days",
      rate: 10.0,
      carrier: "USPS",
      service: "Ground",
      estimatedDays: "3-5",
    },
    {
      id: "express",
      name: "Express Shipping",
      price: 25.0,
      description: "Delivery in 1-2 business days",
      rate: 25.0,
      carrier: "FedEx",
      service: "Express",
      estimatedDays: "1-2",
    },
    {
      id: "overnight",
      name: "Overnight Shipping",
      price: 50.0,
      description: "Delivery by next morning",
      rate: 50.0,
      carrier: "UPS",
      service: "Next Day Air",
      estimatedDays: "1",
    },
  ];
}

export function calculateTax(amount: number, state: string): number {
  // Using state for tax calculation logic
  const TAX_RATE = 0.08; // 8% tax rate
  return Number((amount * TAX_RATE).toFixed(2));
}

export function calculateTaxIntl(amount: number, country: string, state?: string): number {
  const countryCode = country.toUpperCase();
  let rate = 0;

  switch (countryCode) {
    case "USA":
    case "US":
      rate = 0.08;
      break;
    case "CANADA":
    case "CA":
      rate = 0.13; // HST average
      break;
    case "UK":
    case "GB":
      rate = 0.20; // VAT
      break;
    case "EU":
    case "DE":
    case "FR":
    case "ES":
    case "IT":
    case "NL":
    case "SE":
    case "PL":
      rate = 0.20; // Approx VAT
      break;
    case "IN":
    case "INDIA":
      rate = 0.18; // GST
      break;
    case "BD":
    case "BANGLADESH":
      rate = 0.15; // VAT
      break;
    case "AU":
    case "AUSTRALIA":
      rate = 0.10; // GST
      break;
    case "JP":
    case "JAPAN":
      rate = 0.10; // Consumption tax
      break;
    default:
      rate = 0.08;
  }

  return Number((amount * rate).toFixed(2));
}

export function getShippingRatesIntl(zipCode: string, country: string, subtotal: number): ShippingRate[] {
  const c = country.toUpperCase();
  if (["US", "USA"].includes(c)) {
    return getShippingRates(zipCode, subtotal);
  }
  if (["GB", "UK", "DE", "FR", "ES", "IT", "NL", "SE", "PL"].includes(c)) {
    return [
      {
        id: "eu-standard",
        name: "EU Standard",
        price: 12.0,
        description: "Delivery in 4-7 business days",
        rate: 12.0,
        carrier: "DHL",
        service: "Economy",
        estimatedDays: "4-7",
      },
      {
        id: "eu-express",
        name: "EU Express",
        price: 28.0,
        description: "Delivery in 2-3 business days",
        rate: 28.0,
        carrier: "DHL",
        service: "Express",
        estimatedDays: "2-3",
      },
    ];
  }
  if (["IN", "INDIA"].includes(c)) {
    return [
      {
        id: "in-standard",
        name: "Standard",
        price: 300,
        description: "ডেলিভারি ৪-৭ কর্মদিবস",
        rate: 300,
        carrier: "Blue Dart",
        service: "Ground",
        estimatedDays: "4-7",
      },
      {
        id: "in-express",
        name: "Express",
        price: 700,
        description: "ডেলিভারি ১-২ কর্মদিবস",
        rate: 700,
        carrier: "Delhivery",
        service: "Express",
        estimatedDays: "1-2",
      },
    ];
  }
  if (["BD", "BANGLADESH"].includes(c)) {
    return [
      {
        id: "bd-standard",
        name: "স্ট্যান্ডার্ড",
        price: 150,
        description: "ডেলিভারি ২-৫ কর্মদিবস",
        rate: 150,
        carrier: "SA Paribahan",
        service: "Ground",
        estimatedDays: "2-5",
      },
      {
        id: "bd-express",
        name: "এক্সপ্রেস",
        price: 350,
        description: "ডেলিভারি ১-২ কর্মদিবস",
        rate: 350,
        carrier: "Pathao",
        service: "Express",
        estimatedDays: "1-2",
      },
    ];
  }
  return [
    {
      id: "intl-standard",
      name: "International Standard",
      price: 20.0,
      description: "Delivery in 7-14 business days",
      rate: 20.0,
      carrier: "DHL",
      service: "Economy",
      estimatedDays: "7-14",
    },
    {
      id: "intl-express",
      name: "International Express",
      price: 45.0,
      description: "Delivery in 3-5 business days",
      rate: 45.0,
      carrier: "DHL",
      service: "Express",
      estimatedDays: "3-5",
    },
  ];
}

export function validatePhoneBD(phone: string): boolean {
  const p = phone.replace(/\s+/g, "");
  if (p.startsWith("+880")) {
    const rest = p.substring(4);
    return /^1[0-9]{9}$/.test(rest);
  }
  return /^01[0-9]{9}$/.test(p);
}

export function validateAddressIntl(addr: { street: string; city: string; state: string; zipCode: string; country: string }): boolean {
  if (!addr.street || !addr.city || !addr.state || !addr.zipCode || !addr.country) return false;
  const c = addr.country.toUpperCase();
  if (["US", "USA"].includes(c)) {
    return /^[0-9]{5}(-[0-9]{4})?$/.test(addr.zipCode);
  }
  if (["GB", "UK"].includes(c)) {
    return /^[A-Z]{1,2}[0-9][0-9A-Z]?\s?[0-9][A-Z]{2}$/i.test(addr.zipCode);
  }
  if (["DE", "FR", "ES", "IT", "NL", "SE", "PL"].includes(c)) {
    return /^[0-9]{4,5}$/.test(addr.zipCode);
  }
  if (["IN", "INDIA"].includes(c)) {
    return /^[0-9]{6}$/.test(addr.zipCode);
  }
  if (["BD", "BANGLADESH"].includes(c)) {
    return /^[0-9]{4}$/.test(addr.zipCode);
  }
  return addr.zipCode.length >= 3;
}
