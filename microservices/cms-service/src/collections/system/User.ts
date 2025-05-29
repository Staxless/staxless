import { isAdmin, isAdminFieldLevel } from "@/access/isAdmin";
import { isAdminOrSelf, isAdminOrSelfFieldLevel } from "@/access/isAdminOrSelf";
import { UserAuthStrategy } from "@/lib/userAuthStrategy";
import { CollectionConfig } from "payload";

export const User: CollectionConfig = {
  slug: "user", // Matches MongoDB collection 'user'
  dbName: "users", // Matches MongoDB collection 'user'
  admin: {
    group: "General",
    useAsTitle: "first_name",
  },
    auth: {
    disableLocalStrategy: true,
    strategies: [UserAuthStrategy],
    cookies: {
      sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
      secure: process.env.NODE_ENV === 'production',
    },
  },
  fields: [
    {
      name: "id",
      type: "text",
      unique: true,
      required: true,
      index: true,
      admin: {
        readOnly: false
      },
    },
    {
      name: "first_name",
      type: "text",
    },
    {
      name: "last_name",
      type: "text",
    },
    {
      name: "email",
      type: "email",
      unique: true,
      required: false,
      admin: {
        description: "User's email address.",
      },
    },
    {
      name: 'roles',
      type: 'select',
      access: {
        create: isAdminFieldLevel,
        read: isAdminOrSelfFieldLevel,
        update: isAdminFieldLevel,
      },
      defaultValue: ['public'],
      hasMany: true,
      options: ['admin', 'public'],
      required: true,
    },
    {
      name: "lastActive",
      type: "date",
      admin: {
        description: "Last active timestamp for the user.",
      },
    },
  ],
  access: {
    create: isAdmin,
    delete: isAdminOrSelf,
    read: () => true,
    update: isAdminOrSelf,
  }
  // endpoints: [AdminLogoutEndpoint],
};

export default User;