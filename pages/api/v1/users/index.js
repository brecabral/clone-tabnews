import { createRouter } from "next-connect";
import controller from "infra/controller";
import user from "models/user";

const router = createRouter();

router.post(postHandler);

export default router.handler(controller.errorHandler);

async function postHandler(request, response) {
  const userIputValues = request.body;
  const newUser = await user.create(userIputValues);
  return response.status(201).json(newUser);
}
