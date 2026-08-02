import { connection } from "next/server";
import StaffPage from "../_components/StaffPage";

export default async function Page() {
  await connection();

  return <>
    <StaffPage />
  </>
    ;
}