import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'email cannot be emtpy').email('wrong email format'),
  password: z.string().min(1, 'password cannot be emtpy'),
});

export const registerSchema = z.object({
  email: z.string().min(1, 'email cannot be empty').email('wrong email format'),
  password: z.string().min(1, 'password cannot be emtpy'),
  phone: z.string().min(1, 'phone number cannot be emtpy'),
  name: z.string().min(1, 'name number cannot be emtpy'),
});

export const authAccessSchema = z.object({
  refresh_token: z.string().min(1, 'refresh_token must be included in cookies'),
  access_token: z.string().min(1, 'access_token must be included in cookies'),
});

export const updateUserSchema = z.object({
  email: z
    .string({ message: 'email is required' })
    .min(1, 'email cannot be empty')
    .email('wrong email format'),
  name: z
    .string({ message: 'name is required' })
    .min(1, 'name number cannot be emtpy'),
});

export const updatePasswordSchema = z.object({
  refresh_token: z.string().min(1, 'refresh_token must be included in cookies'),
  access_token: z.string().min(1, 'access_token must be included in cookies'),
  password: z.string().min(1, 'password cannot be emtpy'),
});
