const dgram = require("dgram");
const { Buffer } = require("buffer");

var testmessages = [
  "!AIVDM,1,1,,B,13=8ur0016QgHf2R=2;aeGp48H2R,0*79",
  "!AIVDM,1,1,,B,13aPN7C000QgHr0RG>j18PHf00S1,0*74",
  "!AIVDM,1,1,,B,402<Hk1vIu1IO1hjkHRKha?0249T,0*24",
  "!AIVDM,1,1,,A,402<Hk1vIu1IS1hjk@RKhaO0249T,0*43",
];

const buf1 = Buffer.from(testmessages[process.argv[2] ? process.argv[2] : 1]);
const buf2 = Buffer.from("bytes");
const client = dgram.createSocket("udp4");
client.send(buf1, 3000, "127.0.0.1", (err) => {
  console.log("Message sent");
  client.close();
});
