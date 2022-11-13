import { IProfile } from "./Profile.interface";
import { FC } from "react";

const Profile: FC<IProfile> = (props) => {
  const { account, balance } = props;
  return (
    <div className="flex flex-row items-center mr-8">
      <span className="mr-8">{account?.accountId}</span>
      <span>{balance}Ⓝ</span>
    </div>
  );
};
export default Profile;
