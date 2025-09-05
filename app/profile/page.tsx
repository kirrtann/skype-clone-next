import useUser from "../zustand/useUser";

export const Profile = () => {
  const user = useUser();
  return (
    <>
      <div>
        <h1>{user.user.name}</h1>
      </div>
    </>
  );
};
