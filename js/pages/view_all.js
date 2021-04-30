core.controllers.ViewAll = function () {
  core.log('View All initialized');
  core.vars.title = 'View All Posts';
  
  const months = [
    'January',    'February',   'March',    'April',
    'May',        'June',       'July',     'August',
    'September',  'October',    'November', 'December'
  ];
  
  function loadContent (res) {
    if (res.status) {
      const posts = res.payload;
      const html = `
      ${Object.keys(posts).map(year => {
        return Object.keys(posts[year]).map(month => {
          return Object.keys(posts[year][month]).map(date => {
            return Object.keys(posts[year][month][date]).map(ts => {
              const post = posts[year][month][date][ts]
              const { title, body } = post;
              return `
                <article class="m-b">
                  <h3>${title}</h3>
                  <h4 class="caption">${months[month - 1]} ${date}, ${year}</h4>
                  <div class="pre-wrap">${body}</div>
                </article>
              `;
            }).join('')
          }).join('')
        }).join('')
      }).join('')}
      `;
      
      $$('.posts').innerHTML = html;
    } else {
      core.log('Error retrieving content');
    }
  }
  
  // $$.ajax({
  //   type: 'json',
  //   url: 'php/app.php',
  //   params: {
  //     action: 'get_content',
  //     user_id: cms.user
  //   },
  //   success: loadContent
  // });
  
  const testPostPath = `content/${cms.user.id}/2021/04/28/1619634072849.json`;

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