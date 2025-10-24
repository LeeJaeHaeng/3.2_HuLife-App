// app/index.js
import { Redirect } from 'expo-router';

export default function StartPage() {
  return <Redirect href="/home" />;
}