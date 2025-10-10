import SectionTitle from "../Common/SectionTitle";
import SingleTicket from "./SingleTicket";
import ticketData from "./ticketData";

const Ticket = () => {
  return (
    <section
      id="Азтангууд"
      className="bg-gray-light dark:bg-bg-color-dark py-16 md:py-20 lg:py-28"
    >
      <div className="container">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold text-black dark:text-white mb-4" style={{ fontFamily: 'var(--font-vollkorn), serif' }}>
           СУПЕР Азтангууд
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 md:gap-x-6 lg:gap-x-8 xl:grid-cols-3">
          {ticketData.map((ticket) => (
            <div key={ticket.id} className="w-full">
              <SingleTicket ticket={ticket} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Ticket;
