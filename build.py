#!/usr/bin/env python3
import json, pathlib
R = pathlib.Path(__file__).parent
d = json.loads((R/'assets/logo_paths.json').read_text())
h = (R/'src/index.html').read_text()
for k, v in d.items(): h = h.replace('{{%s}}' % k, v)
h = h.replace('/*CSS*/', (R/'src/style.css').read_text()).replace('/*JS*/', (R/'src/app.js').read_text())
(R/'index.html').write_text(h)
print('index.html', len(h))
