let routes = [];
let templates = {};

let app_div = document.getElementById('app');

function home() {
    let div = document.createElement('div');
    let link1 = document.createElement('a');
    link1.href = '/about';
    link1.innerText = ' About ';
    let link2 = document.createElement('a');
    link2.href = '/contact';
    link2.innerText = ' Contact ';

    div.innerHTML = '<h1>Home</h1>';
    div.appendChild(link1);
    div.appendChild(link2);

    app_div.innerHTML = '';
    app_div.appendChild(div);
};

function about() {
    let div = document.createElement('div');
    let link = document.createElement('a');
    link.href = '/';
    link.innerText = ' Home ';
    let link2 = document.createElement('a');
    link2.href = '/contact';
    link2.innerText = 'Contact';


    div.innerHTML = '<h1>About page</h1>';
    div.appendChild(link);
    div.appendChild(link2);

    app_div.innerHTML = '';
    app_div.appendChild(div);
};

function contact() {
  let div = document.createElement('div');
  let link = document.createElement('a');
  link.href = '/';
  link.innerText = ' Home ';
  let link1 = document.createElement('a');
  link1.href = '/about';
  link1.innerText = ' About ';

  div.innerHTML = '<h1>Contact page</h1>';
  div.appendChild(link);
  div.appendChild(link1);

  app_div.innerHTML = '';
  app_div.appendChild(div);
};

function route (path, template) {
  if (typeof template === 'function') {
      routes.push({path: path, template: template});
  }
  else if (typeof template === 'string') {
      routes.push({path: path, template: templates[template]});
  } else {
      return;
  };
};

function template (name, templateFunction) {
  return templates[name] = templateFunction;
};

template('home', function(){
  home();
});

template('about', function(){
  about();
});

template('contact', function(){
  contact();
});

route('/', 'home');
route('/contact', 'contact');
route('/about', 'about');

function resolveRoute(route) {
  try {
      const f = routes.filter(elem => elem.path === route);
      return f[0].template;
  } catch (e) {
      throw new Error(`Route ${route} not found`);
  };
};

function router(evt) {
  let url = window.location.pathname || '/';
  let route = resolveRoute(url);
  route();
};

window.addEventListener('load', router);

const createMyHistory = () => {
  const listenerList = [];
  const listen = (listener) => {
    listenerList.push(listener);
  };
  const push = (args) => {
    window.history.pushState(null, null, args);
    listenerList.length > 0 &&
      listenerList.forEach((listener) => {
        listener(window.location);
      });
  };
  const replace = (args) => {
    console.log('here1', location.pathname)
    window.history.replaceState(null, null, args);
    listenerList.length > 0 &&
      listenerList.forEach((listener) => {
        console.log('here2', location.pathname)
        listener(window.location);
      });
  };
  return { listen, push, replace };
};

const myHistory = createMyHistory();


app_div.onclick = (event) => {
  event.preventDefault();
  const pageId = event.target.href;
  myHistory.push(pageId);
}

const matchRoutes = (routes, location) => {
  let match = {
    path: "/",
    template: () => "404 not fount"
  };
  routes.forEach((route) => {
    if (route.path === location.pathname ) {
      match = route;
    }
  });
  return match;
};

const listener = (location) => {
  const match = matchRoutes(routes, location);
  match.template();
};

myHistory.listen(listener);

function myBack() {
  window.history.back();
}

function myForward() {
  window.history.forward();
}

window.addEventListener('popstate', function(e){
  myHistory.replace(location.pathname);
}, false);
