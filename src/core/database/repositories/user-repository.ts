import { User } from "@/core/database/models/User";


export const UserRepository = {
  async findById(id: string) {
    return User.findById(id);
  },

  async findByEmail(email: string) {
    return User.findOne({ email });
  },

  async create(data: Record<string, unknown>) {
    return User.create(data);
  },

  async updateById(id: string, data: Record<string, unknown>) {
    return User.findByIdAndUpdate(id, { $set: data }, { new: true });
  },

  async deleteById(id: string) {
    return User.findByIdAndDelete(id);
  },

  async find(filter: Record<string, unknown> = {}) {
    return User.find(filter).sort({ createdAt: -1 });
  },

  async count(filter: Record<string, unknown> = {}) {
    return User.countDocuments(filter);
  },
};
