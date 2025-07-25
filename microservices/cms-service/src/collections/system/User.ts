import type { CollectionConfig } from 'payload';
import { isAdmin, isAdminFieldLevel } from '@/access/is-admin';
import {
  isAdminOrSelf,
  isAdminOrSelfFieldLevel,
} from '@/access/is-admin-or-self';
import { UserAuthStrategy } from '@/lib/user-auth-strategy';

export const User: CollectionConfig = {
  slug: 'user', // Matches MongoDB collection 'user'
  dbName: 'users', // Matches MongoDB collection 'user'
  admin: {
    group: 'General',
    useAsTitle: 'firstname',
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
      name: 'id',
      type: 'text',
      unique: true,
      required: true,
      index: true,
      admin: {
        readOnly: false,
      },
    },
    {
      name: 'firstname',
      type: 'text',
    },
    {
      name: 'lastname',
      type: 'text',
    },
    {
      name: 'email',
      type: 'email',
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
      name: 'lastActive',
      type: 'date',
      admin: {
        description: 'Last active timestamp for the user.',
      },
    },
  ],
  access: {
    create: isAdmin,
    delete: isAdminOrSelf,
    read: () => true,
    update: isAdminOrSelf,
  },
  // endpoints: [AdminLogoutEndpoint],
};

export default User;
