import usersSchema from "@/types/usersSchema";
import prisma from "@/lib/prisma";
import { executeAction } from "@/lib/executeAction";

const signUp = async (formData: FormData) => {
  return executeAction({
    actionFn: async () => {
      const name = formData.get("name");
      const email = formData.get("email");
      const password = formData.get("password");
      const validatedData = usersSchema.parse({ email, password,name });
      await prisma.user.create({
        data: {
          email: validatedData.email.toLocaleLowerCase(),
          password: validatedData.password,

          role: "USER",
        },
      });
    },
    successMessage: "Signed up successfully",
  });
};

export { signUp };
