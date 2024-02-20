const mongoose=require("mongoose");
const Chat=require("./models/chat.js");
main().then(()=>{
    console.log("connection successful");
}).catch(err => console.log(err));
async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/fakewhatsapp');
}
let allChats=[
    {
        from:"Prinjal",
        to:"Ritul",
        msg:"Chal na ghar chalte hai",
        created_at:new Date()
    },
    {
        from:"Ritul",
        to:"Sarvesh",
        msg:"Prinjal to ghar jane ka bol rhi hai",
        created_at:new Date()
    },
    {
        from:"Sarvesh",
        to:"Prinjal",
        msg:"Kyu abhi ghar jana hai, ruk jana mera birthday hai 3ko to:) ",
        created_at:new Date()
    },
    {
        from:"Prinjal",
        to:"Sarvesh",
        msg:"Thik hai abhi tu itna bol rha hai to nhi jate hai!",
        created_at:new Date()
    },
    {
        from:"Sarvesh",
        to:"Ritul",
        msg:"Mene bola ki mt jaoo na to bole thike chalo baad me jayenge",
        created_at:new Date()
    },
    {
        from:"Ritul",
        to:"Prinjal",
        msg:"Chal tujhe ghumna hai to tea post chlte hai apn teeno :) , for a break!",
        created_at:new Date()
    }
]

Chat.insertMany(allChats);

