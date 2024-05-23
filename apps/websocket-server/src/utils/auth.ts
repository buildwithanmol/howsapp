import axios from 'axios';
export const verify = async ({ user_id, session }: { user_id: string, session: string }): Promise<boolean> => {
  try {
    const data = await axios.post(`${process.env.HTTP_BASE_URL}/auth/verify`, {
      user_id,
      session
    });

    if (!data.data.success) {
      return false
    }
    return true
  } catch (error) {
    return false;
  }
};