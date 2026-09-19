import { getAllUsers } from './model.js';

export async function fetchAllUsers() {
  return getAllUsers();
}