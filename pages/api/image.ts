import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
  organization:"org-CsVu2X9EB2qSYzkcSKAXN43v"
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  console.error(process.env.OPENAI_API_KEY)
  const createImage = await  openai.createImage({
    prompt: req.body.message,
    n:2,
    size: "1024x1024",
    response_format:"b64_json"
  });
  console.log(createImage.data);
  res.status(200).json({ result: createImage.data.data });
}

function reviewPrompt(ticket) {
  console.log(new Date().toLocaleDateString('it-IT'))
  var ciao= `
  estri le seguenti informazioni da: ${ticket.product}
  
  name: ${ticket.nome}
  surname: ${ticket.cognome}
  email: ${ticket.email}
  date: 
  title: : 
  description: 
  status: 
  priority: 
  category: 
  
  restituisce le infomazioni in formato json
  la priorità può essere: alta, media, bassa
  lo stato puo' essere:aperto, chiuso, in lavorazione, in attesa, rifiutato
    la categoria è una stringa che può essere: hardware, software, rete, altro
    oggi è il ${new Date().toLocaleDateString('it-IT')}  e il campo date in formato italiano
    e  deve essere calcolato sulla base dell informazioni presenti in :${ticket.product} 
    title è il topic del ticket massimo due parole
    description è la descrizione del ticket
  

  
  

  `
  console.log(ciao);
  return ciao
}
