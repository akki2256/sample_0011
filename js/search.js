/**
 * Client-side search index for Utsaah Foundation website.
 * Used by search.html to find pages matching the user's query.
 */
var SEARCH_INDEX = [
  {
    url: 'index.html',
    title: 'Home',
    text: 'Utsaah Foundation creating impact together cancer patients families Mumbai non-profit Tata Memorial Hospital financial assistance guidance resources treatment food accommodation medicines blood donors emotional support counseling cancer survivors recovery'
  },
  {
    url: 'who-we-are.html',
    title: 'Who We Are',
    text: 'Utsaah Foundation non-profit Mumbai cancer patients families support Tata Memorial Hospital financial assistance guidance resources treatment food accommodation medicines blood donors emotional support counseling survivors recovery mission vision values'
  },
  {
    url: 'what-we-do.html',
    title: 'What We Do',
    text: 'Programmes initiatives cancer patient support financial aid accommodation medicines blood donors emotional support counseling Tata Memorial Hospital treatment patients travel India'
  },
  {
    url: 'who-we-work-with.html',
    title: 'Who Do We Work With',
    text: 'Tata Memorial Hospital partners doctors volunteers donors corporates NGOs cancer care patients families'
  },
  {
    url: 'events.html',
    title: 'Our Programmes',
    text: 'Events programmes health camps awareness workshops community outreach'
  },
  {
    url: 'gallery.html',
    title: 'Gallery',
    text: 'Photo gallery events field visits community programmes'
  },
  {
    url: 'team.html',
    title: 'Our Team',
    text: 'Team members staff volunteers Utsaah Foundation'
  },
  {
    url: 'careers.html',
    title: 'Careers',
    text: 'Jobs careers vacancies join Utsaah Foundation work with us'
  },
  {
    url: 'contact.html',
    title: 'Contact',
    text: 'Contact us email phone address Utsaah Foundation get in touch'
  },
  {
    url: 'donate.html',
    title: 'Donate',
    text: 'Donate support cancer patients financial contribution Razorpay'
  }
];

function searchSite(query) {
  if (!query || typeof query !== 'string') return [];
  var q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  var results = [];
  var words = q.split(/\s+/);
  SEARCH_INDEX.forEach(function (entry) {
    var titleLower = entry.title.toLowerCase();
    var textLower = entry.text.toLowerCase();
    var score = 0;
    words.forEach(function (word) {
      if (titleLower.indexOf(word) !== -1) score += 10;
      if (textLower.indexOf(word) !== -1) score += 1;
    });
    if (score > 0) {
      results.push({ url: entry.url, title: entry.title, score: score });
    }
  });
  results.sort(function (a, b) { return b.score - a.score; });
  return results;
}
