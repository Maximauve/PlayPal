import Loader from '@/components/loader';
import LoanDisplay from "@/components/loan-display";
import { useGetWaintingLoansQuery } from '@/services/loan';

export default function LoanWaitingList( ) {


  const { isLoading, data } = useGetWaintingLoansQuery();

  return (
    <section className="">
      <div className="overflow-scroll max-h-[92vh]">
        { isLoading ? (
          <Loader />
        ) : data && data.length > 0 && (
          <div className="">
            {data.map((loan) => (
              <div key={loan.id}  className="flex" >
                <LoanDisplay loan={loan} />
              </div>
            ))}
          </div>
        )}
      </div>

    </section>  
  );
};