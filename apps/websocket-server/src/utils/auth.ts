export const verify = async (session: string): Promise<boolean> => {
    try {
      return true;  
    } catch (error) {
        return false;
    }
};