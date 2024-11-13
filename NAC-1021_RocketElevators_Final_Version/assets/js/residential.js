// Declare agent variables
const AGENT_RATING = 95;
let agentData = [];
const AGENTS_LIST_URL = 'http://99.79.77.144:3000/api/agents';
const AGENT_TABLE_HEAD = document.getElementById('table-head-agent');
const AGENT_TABLE_BODY = document.getElementById('agent-table-body');
// Declare region type variable
const REGION_TYPE_SELECT = document.getElementById('regions');
// Declare button table variable
let tableButtons = document.querySelectorAll('th button');

// Window onload agent list & render body table
window.onload = async () => {
  const RESPONSE = await fetch(AGENTS_LIST_URL);
  agentData = await RESPONSE.json();
  console.log(agentData);
  renderBodyTable(agentData, 'all');
};

// Function to render body table with agents
function renderBodyTable(agents, region) {
  AGENT_TABLE_BODY.innerHTML = '';
  AGENT_TABLE_HEAD.style.backgroundColor = '#A94545';
  let rowNumber = 1;

  for (const AGENT of agents) {
    if (
      AGENT.rating >= AGENT_RATING &&
      (region === 'all' || AGENT.region === region)
    ) {
      const row = `
                <tr>
                    <td>${rowNumber++}</td>
                    <td>${AGENT.first_name}</td>
                    <td>${AGENT.last_name}</td>
                    <td>${AGENT.fee}</td>
                    <td>${AGENT.rating}</td>
                    <td>${AGENT.region}</td>
                </tr>
            `;
      AGENT_TABLE_BODY.innerHTML += row;
    }
  }
  AGENT_TABLE_BODY.innerHTML = AGENT_TABLE_BODY.innerHTML || 'NO AGENT FOUND';
}

// Add event listener when region type change
REGION_TYPE_SELECT.addEventListener('change', () => {
  const REGION_TYPE = REGION_TYPE_SELECT.value;
  renderBodyTable(agentData, REGION_TYPE);
});

// For loop with add event listener when header button is clicked & sort data
tableButtons.forEach((button) => {
  let isCorrectDirection = true;
  button.addEventListener('click', () => {
    const REGION_TYPE = REGION_TYPE_SELECT.value;
    const BUTTON_ID = button.id;

    agentData.sort((a, b) => {
      const compareValue = (prop) =>
        (isCorrectDirection ? a[prop] < b[prop] : a[prop] > b[prop]) ? -1 : 1;

      if (BUTTON_ID === 'first_name') return compareValue('first_name');
      if (BUTTON_ID === 'last_name') return compareValue('last_name');
      if (BUTTON_ID === 'fee') return compareValue('fee');
      if (BUTTON_ID === 'rating') return compareValue('rating');
    });

    renderBodyTable(agentData, REGION_TYPE);
    isCorrectDirection = !isCorrectDirection;
  });
});
