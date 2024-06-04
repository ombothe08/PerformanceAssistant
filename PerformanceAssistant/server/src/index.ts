import express, { Request, Response } from 'express';
import {OpenAIService} from "./OpenAIService";
import { Authenticator } from './Authenticator/Authenticator';
import { BatchAnalysisModel, UserCredentials,StrengthAnalysisModel,CandidateAnalysisModel, CandidateStrengthAnalysis} from './Interfaces/Interface';
import cors from "cors";
import { Database } from './Database/database';



const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

app.use(cors<Request>());

app.post('/login', async (req: Request, res: Response) => {
  const authenticator = new Authenticator();
  const userCredentials: UserCredentials = req.body;
  
  let result = await authenticator.authenticate(userCredentials);
  console.log(result);
  res.send(result);
  
});

app.post('/evaluate', async (req: Request, res: Response) => {
  let oaiService = new OpenAIService();
  
  oaiService.evaluate(req.body).then((response)=>{
    const json = JSON.parse(response);
    const data = json as BatchAnalysisModel

      
      

    let am = data.BatchData.AnalysisModel; // am = analysis model

    let samList: StrengthAnalysisModel[] = []; // samList = strenght analysis model
    am.forEach((cam: CandidateAnalysisModel) => { // cam = candidate analysis model
      let sam :StrengthAnalysisModel = {
        Name: cam.Name,
        Strengths: cam.Strengths
      }
      samList.push(sam);
    })

    oaiService.evaluateStrength(samList).then((response) => {
      //save to database
      const strengthjson = JSON.parse(response);
      const strengthdata = strengthjson as CandidateStrengthAnalysis
      data.BatchData.CandidateStrengthAnalysis = strengthdata;
      console.log("in index = "  );
      console.log(strengthdata);
      let db = new Database('mongodb://localhost:27017', 'PerformanceAssistance_DB');
      db.connectToDatabase();
      db.addReport(data);


    }).catch((error) => {
      res.send(error);
    });

      res.send(response);
  }).catch((error)=>{
      res.send(error);
  });
});

app.post('/evaluate/strengths', async (req: Request, res: Response) => {
  // let oaiService = new OpenAIService();
  
  // oaiService.evaluateStrength(req.body).then((response)=>{
    
  //     res.send(response);
  // }).catch((error)=>{
  //     res.send(error);
  // });
});

app.post("/getSelectedRecord",async(req:Request,res:Response) => {

    let objid = req.body.Key;
    let db = new Database('mongodb://localhost:27017', 'PerformanceAssistance_DB');
    db.connectToDatabase();
    let dbreport =  await db.getReportById(objid); 
    
    console.log(dbreport);
    res.send(JSON.stringify(dbreport));
});


app.get("/getAllRecords", async (req: Request, res: Response) => {
  try {
    const database = new Database('mongodb://localhost:27017', 'PerformanceAssistance_DB');
    await database.connectToDatabase();
    const records = await database.getAllRecords("reports");
    res.send(records);
  } catch (error) {
    console.error('Failed to get records', error);
    res.status(500).send('Failed to get records');
  }
});

app.delete("/delete/:id", async (req: Request, res: Response) => {
  try {
    const database = new Database('mongodb://localhost:27017', 'PerformanceAssistance_DB');
    await database.connectToDatabase();
    const reportId = req.params.id;
    const result = await database.deleteReportById(reportId);
    if (result.deletedCount === 1) {
      res.send(`Report with ID ${reportId} deleted successfully`);
    } else {
      res.status(404).send(`No report found with ID ${reportId}`);
    }
  } catch (error) {
    console.error('Failed to delete record', error);
    res.status(500).send('Failed to delete record');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
