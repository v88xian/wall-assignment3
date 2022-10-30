import UserRoutes from "../routes/api/users.routes";
import MessageRoute from "../routes/api/messages.routes";
import CommentRoute from "../routes/api/comments.routes";

let APIRoute = (App) => {

    App.use("/users/", UserRoutes);
    App.use("/messages/", MessageRoute);
    App.use("/comments/", CommentRoute);

}

module.exports = APIRoute;