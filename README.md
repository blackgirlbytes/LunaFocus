# LunaFocus
a Web5 app designed to give users complete control over their family planning and fertility data using TBD’s open source SDKs

## Getting Started

### Installation

In your terminal, run the following command:
```bash
npm install
```

### Running locally
In your terminal, run the following command:
```bash
npm run dev
```

 ### To contribute
 - Fork the project
 - Clone the project
 - Open a PR to merge changes from your fork to this main branch/repo

## Tech Stack
- Next.js / React
- Tailwind CSS
- Web5 SDK

## How do I implement Web5?
Check out `http://localhost:3000/DueDateCalculator` and the file `src/pages/DueDateCalculator.js` for a demonstration. This takes three values (dueDate, trimester, and weeksPregnant) and stores them in a Decentralized Web Node. 
```js
  const storePregnancyDataInDWN = async (dueDate, weeks, trimester) => {
    if (!web5 || !userDid) return;

    const pregnancyData = {
      dueDate: dueDate.toString(),
      weeks,
      trimester,
    };

   const {record} =  await web5.dwn.records.create({
      did: userDid,
      data: {
        content: JSON.stringify(pregnancyData),
        description: "Pregnancy Due Date Information",
      },
      message: {
        dataFormat: 'application/json',
      },
    });
    console.log('Pregnancy data stored in DWN', await record.data.text(), await record)
  };
```

### Web5 documentation
Learn more at developer.tbd.website
