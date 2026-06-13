import prisma from "../lib/prisma.js";

const generateUniqueConnectcode = async () => {
  let code;
  let exists = true;

  while (exists) {
    code = Math.random().toString(36).substring(2, 8).toUpperCase();

    const user = await prisma.user.findUnique({
      where: { connectCode: code },
    });

    if (!user) exists = false;
  }

  return code;
};

export default generateUniqueConnectcode;