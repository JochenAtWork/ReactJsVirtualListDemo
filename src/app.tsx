﻿import * as React from 'react';
import { render } from 'react-dom';

import { List } from './list';

interface IRootProps {
}

interface IRootState {
}

const names = [];

for (let i = 0; i++ < 10000;)
    names.push(`Item ${i}`);

const height = 50;

class Root extends React.PureComponent<IRootProps, IRootState>
{
    render(): JSX.Element {
        return <List itemHeight={height}>{names.map(name => <div key={name} style={{ height: `${height}px` }}>{name}<img src="http://jochen.jochen-manns.de/wp-content/uploads/2016/08/Dashboard.png" height={30}/></div>)}</List>;
    }
}

render(<Root />, document.querySelector('em-root'));

export default undefined;