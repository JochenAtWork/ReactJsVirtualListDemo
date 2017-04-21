﻿import * as React from 'react';

import ViewModel, { IVirtualList, IVirtualListSite, IVirtualListItems, IVirtualListSlider, IViewModelProps } from './viewModel';

interface INoState {
}

class List extends React.Component<IViewModelProps<IVirtualListItems>, INoState>{
    private _outer: HTMLDivElement;

    render(): JSX.Element {
        const children = React.Children.toArray(this.props.children) || [];

        return <div className='istk-list-items' ref={e => this._outer = e}>
            {children.slice(this.props.vm.start, this.props.vm.start + this.props.vm.count)}
        </div>;
    }

    componentWillMount(): void {
        this.props.vm.setTotal(React.Children.count(this.props.children));

        window.addEventListener('resize', this.recalculateCount);
    }

    componentWillUnmount(): void {
        window.removeEventListener('resize', this.recalculateCount);
    }

    componentDidMount(): void {
        this.recalculateCount();
    }

    private recalculateCount = () => this.props.vm.setHeight(this._outer.clientHeight);
}

class Scroll extends React.Component<IViewModelProps<IVirtualListSlider>, INoState>{
    render(): JSX.Element {
        return this.props.vm &&
            <div className='istk-list-scroll' onClick={this.onClickToMove}>
                <div />
                <div style={{ height: `${this.props.vm.sliderHeight}%`, top: `${this.props.vm.sliderPosition}%` }} onMouseDown={this.onClickToDrag} />
            </div>;
    }

    private onClickToMove = (ev: React.MouseEvent<HTMLDivElement>) => {
        const y = ev.pageY - ev.currentTarget.offsetTop;
        if (y < 0)
            return;

        const h = ev.currentTarget.clientHeight;
        if (y > h)
            return;

        this.props.vm.setPosition(y / h);
    }

    private onClickToDrag = (ev: React.MouseEvent<HTMLDivElement>) => {
        ev.preventDefault();

        const parent = ev.currentTarget.parentElement;

        this.props.vm.startDrag(ev.pageX, ev.pageY, parent.offsetLeft, parent.offsetTop, parent.offsetWidth, parent.offsetHeight);
    }

    private onStopDrag = (ev: MouseEvent) => {
        this.props.vm.endDrag();
    }

    private onDrag = (ev: MouseEvent) => {
        this.props.vm.drag(ev.pageX, ev.pageY);
    }

    componentWillMount(): void {
        window.addEventListener('mouseup', this.onStopDrag);
        window.addEventListener('mousemove', this.onDrag);
    }

    componentWillUnmount(): void {
        window.removeEventListener('mouseup', this.onStopDrag);
        window.removeEventListener('mousemove', this.onDrag);
    }

}

interface IListProps {
    itemHeight: number;
}

export default class extends React.Component<IListProps, INoState> {
    private _viewModel: IVirtualList;

    render(): JSX.Element {
        return <div className='istk-list'>
            <div>
                <List vm={this._viewModel.itemsViewModel} children={this.props.children} />
                <Scroll vm={this._viewModel.sliderViewModel} />
            </div>
        </div>;
    }

    componentWillMount(): void {
        const refresh = this.forceUpdate.bind(this);

        this._viewModel = new ViewModel(this.props.itemHeight, { refresh });
    }

    componentWillUnmount(): void {
        if (this._viewModel) {
            this._viewModel.disconnect();
            this._viewModel = undefined;
        }
    }
}