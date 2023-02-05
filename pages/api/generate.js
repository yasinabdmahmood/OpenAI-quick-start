import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message: "OpenAI API key not configured, please follow instructions in README.md",
      }
    });
    return;
  }

  const word = req.body.word;
  const description = req.body.description;
  // if (animal.trim().length === 0) {
  //   res.status(400).json({
  //     error: {
  //       message: "Please enter a valid animal",
  //     }
  //   });
  //   return;
  // }

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: generatePrompt(word,description),
      temperature: 0.6,
      max_tokens: 100,
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch(error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: 'An error occurred during your request.',
        }
      });
    }
  }
}

function generatePrompt(word,description) {
  // const capitalizedAnimal =
  //   animal[0].toUpperCase() + animal.slice(1).toLowerCase();
//   return `Suggest three names for an animal that is a superhero.

// Animal: Cat
// Names: Captain Sharpclaw, Agent Fluffball, The Incredible Feline
// Animal: Dog
// Names: Ruff the Protector, Wonder Canine, Sir Barks-a-Lot
// Animal: ${capitalizedAnimal}
// Names:`;
return `A student in english test was asked to give desciption to word ${word} and 
  he gave this description "${description}" grade his description from 1 to 10 based on 
  how good of a description he gave, make sure to give a good description of the word as well 
  when responding assume that you are directly giving the studen the give back by refering
  to them as you instead of the student`;


}
