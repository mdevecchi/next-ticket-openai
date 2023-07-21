import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  console.error(process.env.OPENAI_API_KEY)
  const completion = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: reviewPrompt(req.body),
    max_tokens: 2000,
    temperature: 0.9,
  });
  res.status(200).json({ result: completion.data.choices[0].text });
}

function reviewPrompt(ticket) {
  console.log(new Date().toLocaleDateString('it-IT'))
  return `
  estri le seguenti informazioni da ${ticket.product}
  
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
    e  deve essere calcolato sulla base dell informazioni presenti su ${ticket} 
    title è il topic del ticket massimo due parole
    description è la descrizione del ticket
  

  
  

  `
}
