import { printEnvVars } from "./printEnvVars";
import { Links } from "/imports/api/Links";

printEnvVars();

Links.remove({});
Links.insert({ title: "Do the Tutorial", url: "https://www.meteor.com/tutorials/react/creating-an-app" });
Links.insert({ title: "Follow the Guide", url: "http://guide.meteor.com" });
Links.insert({ title: "Read the Docs", url: "https://docs.meteor.com" });
Links.insert({ title: "Discussions", url: "https://forums.meteor.com" });
