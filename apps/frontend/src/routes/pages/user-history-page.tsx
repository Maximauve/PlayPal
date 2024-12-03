import React from "react";

import LoanHistoryCard from "@/components/cards/loan-history-card";
import { useGetUserLoansQuery } from "@/services/user";

export default function UserHistoryPage(): React.JSX.Element {
  const { data } = useGetUserLoansQuery();
  console.log(data);
  
  return (
    <div className="user-history-page p-6 ">
      {data && data?.map((loan) => (
        <div key={loan.id} className="m-6">
          <LoanHistoryCard loan={loan} />
        </div>
      ))  
      }
    </div>
  );
}