var NotesApp = React.createClass({

    render: function() {
        console.log(this.state.notes);
        return (
            <div className="notes-app">
                test
            </div>
        );
    },


});

ReactDOM.render(
    <NotesApp />,
    document.getElementById('mount');
);