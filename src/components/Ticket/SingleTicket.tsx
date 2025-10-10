import { Ticket } from "@/types/ticket";
import Image from "next/image";
import Link from "next/link";

const SingleTicket = ({ ticket }: { ticket: Ticket }) => {
  const { title, image, paragraph, author, tags, publishDate } = ticket;
  return (
    <>
      <div className="group shadow-one hover:shadow-two dark:bg-dark dark:hover:shadow-gray-dark relative overflow-hidden rounded-xs bg-white duration-300">
        <div className="relative block w-full overflow-hidden">
          <Image 
            src={image} 
            alt="image" 
            width={400}
            height={300}
            className="transition-transform duration-300 group-hover:scale-110 w-full h-auto" 
          />
        </div>
        <div className="p-6 sm:p-8 md:px-6 md:py-8 lg:p-8 xl:px-5 xl:py-8 2xl:p-8">
          <h4 className="text-xl font-bold text-black sm:text-2xl dark:text-white" style={{ fontFamily: 'var(--font-vollkorn), serif' }}>
            {title}
          </h4>
        </div>
      </div>
    </>
  );
};

export default SingleTicket;
