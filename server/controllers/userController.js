const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const { registrationSchema } = require("../utils/validation");
const {encryptResponseBody} = require('../middlewares/encryptionMiddleware')
let data =[
          {
            "_id": "6504507e5684ead3cae76ff4",
            "index": 0,
            "guid": "db3070a8-3c9d-4929-846b-1864cca6c0a2",
            "isActive": true,
            "balance": "$3,758.40",
            "picture": "http://placehold.it/32x32",
            "age": 27,
            "eyeColor": "green",
            "name": "Cassandra Schroeder",
            "gender": "female",
            "company": "FITCORE",
            "email": "cassandraschroeder@fitcore.com",
            "phone": "+1 (845) 470-2928",
            "address": "237 Stewart Street, Finzel, Hawaii, 3038",
            "about": "Elit laborum esse nulla laboris qui Lorem Lorem tempor nisi. Minim deserunt ut sunt ut deserunt est veniam nisi id. Irure irure qui nulla occaecat ut. Officia sint in magna laboris fugiat minim dolor. Nostrud ex eu enim et Lorem nulla.\r\n",
            "registered": "2022-02-10T10:08:56 -06:-30",
            "latitude": 40.269266,
            "longitude": 121.403978,
            "tags": [
              "voluptate",
              "ullamco",
              "et",
              "tempor",
              "incididunt",
              "aute",
              "nulla"
            ],
            "friends": [
              {
                "id": 0,
                "name": "Vonda Oconnor"
              },
              {
                "id": 1,
                "name": "Vivian Morse"
              },
              {
                "id": 2,
                "name": "Pickett Livingston"
              }
            ],
            "greeting": "Hello, Cassandra Schroeder! You have 4 unread messages.",
            "favoriteFruit": "strawberry"
          },
          {
            "_id": "6504507e5d50fc773fd87bf1",
            "index": 1,
            "guid": "78f9b80c-3d9c-442e-992e-a44a996e7e7d",
            "isActive": true,
            "balance": "$2,608.29",
            "picture": "http://placehold.it/32x32",
            "age": 37,
            "eyeColor": "brown",
            "name": "Meghan Roman",
            "gender": "female",
            "company": "SUNCLIPSE",
            "email": "meghanroman@sunclipse.com",
            "phone": "+1 (883) 417-2008",
            "address": "167 Calder Place, Craig, Alaska, 5431",
            "about": "Nulla sunt tempor nisi proident ad aute labore laboris sit exercitation. Est qui et quis ullamco dolore incididunt quis sit laboris eiusmod. Est Lorem occaecat velit cupidatat labore adipisicing dolor cupidatat magna et. Ipsum in commodo nisi reprehenderit veniam magna. Nostrud veniam velit esse nulla Lorem aliqua amet ex cupidatat esse ea. Commodo pariatur elit esse et sit magna consectetur qui eiusmod ea. Laboris veniam aliqua ea sit ut.\r\n",
            "registered": "2021-05-10T01:54:21 -06:-30",
            "latitude": -5.237619,
            "longitude": -129.473123,
            "tags": [
              "id",
              "minim",
              "ipsum",
              "dolor",
              "qui",
              "est",
              "consectetur"
            ],
            "friends": [
              {
                "id": 0,
                "name": "Peggy Mullins"
              },
              {
                "id": 1,
                "name": "Gentry Koch"
              },
              {
                "id": 2,
                "name": "Angelita Small"
              }
            ],
            "greeting": "Hello, Meghan Roman! You have 4 unread messages.",
            "favoriteFruit": "strawberry"
          },
          {
            "_id": "6504507eaf4752077fdd7ecb",
            "index": 2,
            "guid": "149a58a4-edbb-4308-a33e-b13e9436a23a",
            "isActive": true,
            "balance": "$3,357.43",
            "picture": "http://placehold.it/32x32",
            "age": 29,
            "eyeColor": "blue",
            "name": "Beatrice Collier",
            "gender": "female",
            "company": "HINWAY",
            "email": "beatricecollier@hinway.com",
            "phone": "+1 (900) 591-2542",
            "address": "705 Lake Street, Bend, Tennessee, 2001",
            "about": "Laborum nisi velit reprehenderit labore labore nisi cillum in consequat duis nisi proident amet ad. Dolor reprehenderit aliquip consequat esse adipisicing sunt. Ea tempor adipisicing est sit sint occaecat deserunt elit anim commodo mollit exercitation id. Consectetur ut cupidatat cillum veniam. Magna duis velit consequat ea amet reprehenderit aliqua deserunt mollit aute irure irure. Minim consectetur voluptate fugiat aliqua amet sint eiusmod elit.\r\n",
            "registered": "2021-06-20T02:55:22 -06:-30",
            "latitude": 55.199612,
            "longitude": -157.78071,
            "tags": [
              "irure",
              "aliquip",
              "nisi",
              "voluptate",
              "eiusmod",
              "aliquip",
              "eu"
            ],
            "friends": [
              {
                "id": 0,
                "name": "Dawson Pate"
              },
              {
                "id": 1,
                "name": "Burks Daniel"
              },
              {
                "id": 2,
                "name": "Potts Ochoa"
              }
            ],
            "greeting": "Hello, Beatrice Collier! You have 9 unread messages.",
            "favoriteFruit": "banana"
          },
          {
            "_id": "6504507e80b7eefdddc9562c",
            "index": 3,
            "guid": "be7c0a97-133c-4c8d-aeb1-cb9a489c3a87",
            "isActive": true,
            "balance": "$2,200.91",
            "picture": "http://placehold.it/32x32",
            "age": 29,
            "eyeColor": "blue",
            "name": "Suzanne Wright",
            "gender": "female",
            "company": "ZENTIX",
            "email": "suzannewright@zentix.com",
            "phone": "+1 (853) 405-3933",
            "address": "566 Gaylord Drive, Chalfant, Maine, 2786",
            "about": "Tempor qui proident exercitation pariatur duis sit consequat do labore sit ex. Fugiat ea nisi est tempor do. Veniam nulla consectetur cillum occaecat sint excepteur nostrud laborum excepteur adipisicing reprehenderit commodo labore ad. Sit proident ex dolor cillum laboris do ullamco. Dolore deserunt dolor ad ad culpa veniam veniam.\r\n",
            "registered": "2018-05-15T04:53:26 -06:-30",
            "latitude": 82.74322,
            "longitude": -112.141327,
            "tags": [
              "fugiat",
              "aliquip",
              "mollit",
              "do",
              "dolore",
              "minim",
              "qui"
            ],
            "friends": [
              {
                "id": 0,
                "name": "Lola Cervantes"
              },
              {
                "id": 1,
                "name": "Molina Aguirre"
              },
              {
                "id": 2,
                "name": "Sonya Mcbride"
              }
            ],
            "greeting": "Hello, Suzanne Wright! You have 9 unread messages.",
            "favoriteFruit": "banana"
          },
          {
            "_id": "6504507ebfae677015f870b5",
            "index": 4,
            "guid": "1419933d-0673-432b-b5f9-4c615b41be0f",
            "isActive": true,
            "balance": "$1,271.90",
            "picture": "http://placehold.it/32x32",
            "age": 34,
            "eyeColor": "green",
            "name": "Gilliam Horton",
            "gender": "male",
            "company": "ZENOLUX",
            "email": "gilliamhorton@zenolux.com",
            "phone": "+1 (869) 562-3819",
            "address": "920 Agate Court, Sanborn, Louisiana, 9685",
            "about": "Anim mollit tempor reprehenderit occaecat consectetur consequat. Excepteur eu cillum ullamco voluptate incididunt. Aliquip sunt exercitation aute cupidatat duis consectetur labore Lorem ipsum. Commodo commodo tempor reprehenderit enim do nisi exercitation sint consectetur ad nostrud tempor enim ex.\r\n",
            "registered": "2018-12-26T04:43:50 -06:-30",
            "latitude": 14.287301,
            "longitude": -71.939707,
            "tags": [
              "cillum",
              "officia",
              "adipisicing",
              "ad",
              "nisi",
              "eu",
              "reprehenderit"
            ],
            "friends": [
              {
                "id": 0,
                "name": "Joyner Chapman"
              },
              {
                "id": 1,
                "name": "Phillips Frank"
              },
              {
                "id": 2,
                "name": "Barrera Kirk"
              }
            ],
            "greeting": "Hello, Gilliam Horton! You have 2 unread messages.",
            "favoriteFruit": "strawberry"
          },
          {
            "_id": "6504507eb5e948889ac45406",
            "index": 5,
            "guid": "cca67db5-04c6-4076-aef0-adcdc1b2c523",
            "isActive": true,
            "balance": "$2,531.85",
            "picture": "http://placehold.it/32x32",
            "age": 36,
            "eyeColor": "blue",
            "name": "Ginger Barry",
            "gender": "female",
            "company": "ACCUPRINT",
            "email": "gingerbarry@accuprint.com",
            "phone": "+1 (967) 465-3514",
            "address": "503 Degraw Street, Hebron, Texas, 7955",
            "about": "Duis consequat ipsum qui incididunt mollit adipisicing mollit laboris aliqua. Lorem est dolor laborum elit aliquip incididunt ex excepteur amet magna laboris. Adipisicing ad nisi quis aute fugiat irure est sunt commodo. Ea irure sit minim pariatur non nostrud elit commodo. Minim deserunt duis occaecat pariatur mollit adipisicing deserunt nulla ea aute. Lorem voluptate nisi sint labore laborum esse aliquip ipsum duis tempor cupidatat et proident.\r\n",
            "registered": "2018-05-16T11:17:20 -06:-30",
            "latitude": -52.712799,
            "longitude": 148.77268,
            "tags": [
              "ipsum",
              "quis",
              "ullamco",
              "elit",
              "tempor",
              "dolore",
              "pariatur"
            ],
            "friends": [
              {
                "id": 0,
                "name": "Hillary Riley"
              },
              {
                "id": 1,
                "name": "Bradford Santana"
              },
              {
                "id": 2,
                "name": "Cash Pratt"
              }
            ],
            "greeting": "Hello, Ginger Barry! You have 3 unread messages.",
            "favoriteFruit": "apple"
          },
          {
            "_id": "6504507e55c6283fd67a6d0f",
            "index": 6,
            "guid": "1bd08242-52a1-4493-941c-085b3f3f3d4a",
            "isActive": true,
            "balance": "$2,661.75",
            "picture": "http://placehold.it/32x32",
            "age": 35,
            "eyeColor": "brown",
            "name": "Rivera Ingram",
            "gender": "male",
            "company": "LUNCHPAD",
            "email": "riveraingram@lunchpad.com",
            "phone": "+1 (981) 527-2657",
            "address": "189 Bleecker Street, Southview, Montana, 5100",
            "about": "Ut eu aute Lorem magna tempor voluptate. Cillum est laborum adipisicing ex reprehenderit dolor cupidatat esse. Ex sunt amet exercitation incididunt labore sunt adipisicing fugiat adipisicing tempor commodo magna consectetur. Sit cupidatat consequat nisi voluptate est. Reprehenderit minim ea consequat et qui eiusmod qui sunt consectetur dolore laboris. Nulla consectetur magna duis est anim duis enim quis ea aliqua ullamco quis.\r\n",
            "registered": "2020-01-16T01:30:30 -06:-30",
            "latitude": 16.443783,
            "longitude": 99.229022,
            "tags": [
              "officia",
              "eu",
              "adipisicing",
              "nostrud",
              "adipisicing",
              "eiusmod",
              "Lorem"
            ],
            "friends": [
              {
                "id": 0,
                "name": "Lorie Golden"
              },
              {
                "id": 1,
                "name": "Annie Morales"
              },
              {
                "id": 2,
                "name": "Thelma Hawkins"
              }
            ],
            "greeting": "Hello, Rivera Ingram! You have 4 unread messages.",
            "favoriteFruit": "banana"
          }
        ]
const register = async (req, res) => {
  const { error } = registrationSchema.validate(req.body);
  if (error) return res.status(400).send(encryptResponseBody(error.details[0].message));

  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) return res.status(400).send(encryptResponseBody("Email already exists"));

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
    // dummy_data:data
  });

  try {
    const savedUser = await user.save();
    if (savedUser)
      return res.status(200).send(encryptResponseBody({
        status: true,
        message: "User registered successfully",
        data: savedUser,
      }));
  } catch (err) {
    return res.status(400).send(encryptResponseBody({
      status: false,
      message: "Internal server error",
      error: err,
    }));
  }
};

const login = async (req, res) => {
  console.log("email", req.body.email);
  const user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(400).json(encryptResponseBody({
      status: false,
      message: "No registered email found",
    }));

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).json(encryptResponseBody({
      status: false,
      message: "Incorrect password",
    }));

  const token = jwt.sign({ _id: user._id }, process.env.SECRET_KEY);
  res
    .header("auth-token", token)
    .send(encryptResponseBody({ status: true, message: "Login successful", token }));
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).send(encryptResponseBody({ status: true, data :users }));
  } catch (error) {
    console.error({status: false, error});
    res.status(500).send(encryptResponseBody({ status: false, error: "Internal server error" }));
  }
};

const getUserById = async (req, res) => {
  try {
    const userId = req.params.userId;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ status: false, error: "User not found" });
    }

    res.send({ status: true, data :user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, error: "Internal server error" });
  }
};

const updateUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
        },
      },
      { new: true }
    );

    if (!user)
      return res.status(404).send(encryptResponseBody({ status: false, message: "User not found" }));

    res.send(encryptResponseBody({ message:'user updated successfully',data:user }));
  } catch (err) {
    res.status(400).send(encryptResponseBody({ status: false, err }));
  }
};

const deleteUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const user = await User.findByIdAndRemove(userId);

    if (!user)
      return res.status(404).send(encryptResponseBody({ status: false, message: "User not found" }));

    res.send(encryptResponseBody({ status: true, message: "User deleted" }));
  } catch (err) {
    res.status(400).send(encryptResponseBody({ status: false, err }));
  }
};

module.exports = {
  register,
  login,
  updateUser,
  deleteUser,
  getAllUsers,
  getUserById,
};
