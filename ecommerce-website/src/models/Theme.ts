import mongoose, { Document, Model, Schema } from 'mongoose';

export interface ITheme extends Document {
  mode: 'light' | 'dark';
  background: string;
  foreground: string;
  primary: string;
  primaryHover: string;
  cardBg: string;
  cardBorder: string;
  glassBg: string;
  glassBorder: string;
  updatedAt: Date;
}

const ThemeSchema: Schema = new Schema({
  mode: { type: String, required: true, enum: ['light', 'dark'], unique: true },
  background: { type: String, required: true },
  foreground: { type: String, required: true },
  primary: { type: String, required: true },
  primaryHover: { type: String, required: true },
  cardBg: { type: String, required: true },
  cardBorder: { type: String, required: true },
  glassBg: { type: String, required: true },
  glassBorder: { type: String, required: true },
  updatedAt: { type: Date, default: Date.now },
});

export const Theme: Model<ITheme> = mongoose.models.Theme || mongoose.model<ITheme>('Theme', ThemeSchema);
