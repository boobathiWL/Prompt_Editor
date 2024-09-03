import Spinner from "@/components/Spinner";
import Admin from "@/layouts/admin_layout";
import { RootState } from "@/store";
import Link from "next/link";
import React from "react";
import { useSelector } from "react-redux";

function Home() {
  const user = useSelector((state: RootState) => state.user.userData);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (user) {
      setIsLoading(false);
    }
  }, [user]);

  let dashboardItems = [
    {
      title: "Projects",
      description: "View and manage script projects",
      link: "/projects",
    },
  ];

  if (!isLoading && user?.role_name === "super_admin") {
    dashboardItems = [
      {
        title: "Users",
        description: "Manage users and their permissions",
        link: "/users",
      },
      ...dashboardItems,
    ];
  }

  return (
    <div className="p-8 bg-gray-100 h-screen mt-8">
      <div className="sm:flex-auto">
        <h1 className="text-base font-semibold leading-6 text-gray-900">
          Dashboard
        </h1>
      </div>
      {isLoading ? (
        <div className="grid items-center mt-8">
          <Spinner />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {dashboardItems.map((item, index) => (
            <Link href={item.link} key={index}>
              <div className="bg-white p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 cursor-pointer">
                <h2 className="text-2xl font-semibold mb-4">{item.title}</h2>
                <p className="text-gray-600">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default Home;

Home.getLayout = function getLayout(page) {
  return <Admin>{page}</Admin>;
};
