import SingleTicket from "@/components/Ticket/SingleTicket";
import ticketData from "@/components/Ticket/ticketData";
import Breadcrumb from "@/components/Common/Breadcrumb";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog Page | Free Next.js Template for Startup and SaaS",
  description: "This is Blog Page for Startup Nextjs Template",
  // other metadata
};

const Blog = () => {
  return (
    <>
      <Breadcrumb
        pageName="Супер азтангууд"
        description=""
      />

      <section className="pt-[120px] pb-[120px]">
        <div className="container">
          <div className="-mx-4 flex flex-wrap justify-center">
            {ticketData.map((ticket) => (
              <div
                key={ticket.id}
                className="w-full px-4 md:w-2/3 lg:w-1/2 xl:w-1/3"
              >
                <SingleTicket ticket={ticket} />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Blog;
