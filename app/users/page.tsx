import Users from "@/components/Users";
import { db } from "@/lib/db";

const page = async () => {
    // Fetch users
    const users = (await db.user.findMany()).map(user => ({
        id: user.id.toString(),
        name: user.username,
        email: user.email
    }));
  return (
    <div>
      <h1 className="text-2xl font-bold">Users</h1>
      {/* <UserList users={users} /> */}
      <Users users={users}/>
    </div>
 
  )
}

export default page