var r={getItem:function(r){return new Promise(function(e,t){chrome.storage.sync.get(r,function(o){if(chrome.runtime.lastError)return t(chrome.runtime.lastError);e(o[r])})})},setItem:function(r,e){return new Promise(function(t,o){var n;chrome.storage.sync.set(((n={})[r]=e,n),function(){if(chrome.runtime.lastError)return o(chrome.runtime.lastError);t()})})},removeItem:function(r){return new Promise(function(e,t){chrome.storage.sync.remove(r,function(){if(chrome.runtime.lastError)return t(chrome.runtime.lastError);e()})})}},e={getItem:function(r){return new Promise(function(e,t){chrome.storage.session.get(r,function(o){if(chrome.runtime.lastError)return t(chrome.runtime.lastError);e(o[r])})})},setItem:function(r,e){return new Promise(function(t,o){var n;chrome.storage.session.set(((n={})[r]=e,n),function(){if(chrome.runtime.lastError)return o(chrome.runtime.lastError);t()})})},removeItem:function(r){return new Promise(function(e,t){chrome.storage.session.remove(r,function(){if(chrome.runtime.lastError)return t(chrome.runtime.lastError);e()})})}};exports.ChromeLocalStorage={getItem:function(r){return new Promise(function(e,t){chrome.storage.local.get(r,function(o){if(chrome.runtime.lastError)return t(chrome.runtime.lastError);e(o[r])})})},setItem:function(r,e){return new Promise(function(t,o){var n;chrome.storage.local.set(((n={})[r]=e,n),function(){if(chrome.runtime.lastError)return o(chrome.runtime.lastError);t()})})},removeItem:function(r){return new Promise(function(e,t){chrome.storage.local.remove(r,function(){if(chrome.runtime.lastError)return t(chrome.runtime.lastError);e()})})}},exports.ChromeSessionStorage=e,exports.ChromeSyncStorage=r;
//# sourceMappingURL=index.cjs.map
