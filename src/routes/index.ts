var express = require('express');
var router = express.Router();

router.get('/', (req: any, res: any, next: any) => {
  res.status(200);
});

export default router;
