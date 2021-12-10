const Word = require("../model/Word");

const addWord = async (req, res) => {
  const body = req.body;
  const word = body.word;

  const newWord = new Word({
    text: word.toLowerCase(),
  });
  try {
    await newWord.save();
    res.status(200).send("Added word succesfully");
  } catch (error) {
    console.log(error);
    res.status(400).json(error);
  }
};



module.exports = {
  addWord,
};
