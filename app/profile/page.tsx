const Profile = () => {
  const userdata = {
    name: "Kirtan",
    email: "asdsa@gmail.com",
    id: "32432asd32",
    birth_date: "21/11/2006",
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-6">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 border border-gray-200">
        <div className="flex flex-col items-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-md">
            {userdata.name.charAt(0)}
          </div>
          <h2 className="mt-3 text-2xl font-semibold text-gray-800">
            {userdata.name}
          </h2>
          <p className="text-sm text-gray-500">User ID: {userdata.id}</p>
        </div>
        <div className="mt-6 space-y-4">
          <div className="flex items-center space-x-3">
            <span className="w-5 h-5 text-blue-500">📧</span>
            <span className="text-gray-700">{userdata.email}</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="w-5 h-5 text-green-500">📅</span>
            <span className="text-gray-700">{userdata.birth_date}</span>
          </div>
          <div className="flex items-center space-x-3">
            <span className="w-5 h-5 text-purple-500">🆔</span>
            <span className="text-gray-700">{userdata.id}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Profile;
