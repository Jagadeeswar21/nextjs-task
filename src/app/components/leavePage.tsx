import Link from "next/link";
import singlecontact from "./singlecontact";
export default function LeavePage() {
  return (
    <div>
      <div className="flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold">Contacts</h1>
        <button className="bg-blue-500 hover:to-blue-300 text-white px-4 py-2 rounded">
          <Link href="/addcontact">+ Add contact</Link>
        </button>
      </div>
      <div className="mt-2">
        <table className=" w-full">
            <tbody>
                <tr className=" bg-slate-400 h-12 text-black">
                    <th>Date</th>
                    <th>No.of Leaves</th>
                    <th>No.of days</th>
                    <th>Date-Range</th>
                    <th>Status</th>
                    <th>Reason</th>
                </tr>
                {contacts.map((items,i)=>{
                    <singlecontact item={item} key={i}/>
                })}
            </tbody>
        </table>


      </div>
    </div>
  );
}
