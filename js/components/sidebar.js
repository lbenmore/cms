core.controllers.Sidebar = () => {
  core.log('Sidebar initialized');
  const testPostPath = `content/${cms.user.id}/2021/04/28/1619634072849.json`;
  const months = [
    'January',    'February',   'March',    'April',
    'May',        'June',       'July',     'August',
    'September',  'October',    'November', 'December'
  ];
  
  function populateSidebar (files) {
    const html = `
      <ul>
        ${Object.keys(files).map(year => `
        <li><h4>${year}</h4>
          <ul>
            ${Object.keys(files[year]).map(month => `
            <li><h5>${months[month - 1]}</h5>
              <ul>
                ${Object.keys(files[year][month]).map(date => `
                ${Object.keys(files[year][month][date]).map(ts => `
                <li class="pointer">
                  ${files[year][month][date][ts].title} (${month}/${date})
                </li>  
                `).join('')}
                `).join('')}
              </ul>
            </li>  
            `).join('')}
          </ul> 
        </li> 
        `).join('')}
      </ul>
    `;
    
    $$('.sidebar__list').innerHTML = html;
  }
  
  function loadContent (res) {
    if (res.status) {
      if (res.payload) {
        populateSidebar(res.payload);
      } else {
        core.log('User has no content available.');
      }
    } else {
      core.log('Error retrieving user content.');
    }
  }
  
  /*
    can uncomment out ajax functionality
    and remove fetch usage once php has
    been written for getting content
  */
  // $$.ajax({
  //   type: 'json',
  //   url: 'php/app.php',
  //   params: {
  //     action: 'get_content',
  //     user_id: cms.user
  //   },
  //   success: loadContent
  // });

  fetch(testPostPath)
    .then(res => res.json())
    .then(json => {
      loadContent({
        status: 1,
        payload: {
          2021: {
            03: {
              24: {
                1619634072849: {
                  title: 'Test post 1',
                  body: 'bleh blah bleep'
                }
              }
            },
            04: {
              26: {
                1619634072849: {
                  title: 'Test post 2',
                  body: 'doot di doot'
                }
              },
              28: {
                1619634072849: json
              }
            }
          }
        }
      })
    })
    .catch(err => core.log('Error retrieving content', testPostPath));
};