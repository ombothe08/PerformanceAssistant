import { Grid, Checkbox, FormControlLabel, Button, Paper } from '@mui/material';
import {UseExcelParametersReturn} from '../uploadFilePage/UseExcelParametersReturn';

interface ParameterListPageProps {
    useExcelParameters: UseExcelParametersReturn; // Pass UseExcelParametersReturn as a prop
  }

const ParameterListPage: React.FC<ParameterListPageProps> = ({ useExcelParameters }) => {

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(to right, #4299E1, #48BB78, #9F7AEA)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 'calc(100% - 20px)', padding: '20px', margin: 'auto' }}>
        {useExcelParameters.parameters.length > 0 && (
          <Paper style={{ background: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)', height: '400px', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '16px', textAlign: 'center' }}>Select Parameters:</h3>
            <Grid container spacing={4}>
              {useExcelParameters.parameters.map((param, index) => (
                <Grid item key={index} xs={12} sm={6} md={4}>
                  <Paper elevation={2} style={{ padding: '16px', borderRadius: '8px', background: useExcelParameters.selectedParameters.includes(param) ? '#48BB78' : '#4299E1' }}>
                    <FormControlLabel
                      control={<Checkbox color="primary" onChange={useExcelParameters.handleCheckboxChange} name={param} style={{ color: useExcelParameters.selectedParameters.includes(param) ? '#000000' : ' #000000' }} />}
                      label={<span style={{ fontSize: '18px' }}>{param}</span>}
                    />
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Paper>
        )}
        {useExcelParameters.selectedParameters.length > 0 && (
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
            <Button
              variant="contained"
              color="primary"
              onClick={useExcelParameters.submitData}
              style={{ fontSize: '18px' }}
            >
              Generate Report
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
 
export default ParameterListPage;