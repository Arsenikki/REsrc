import ps from 'current-processes';

export default function handler(req, res) {
  ps.get((err, processes) => {
    if (err) {
      console.log("Error while getting process information: ", err);
    }
    res.status(200).json({ value: processes });
  });  
}
