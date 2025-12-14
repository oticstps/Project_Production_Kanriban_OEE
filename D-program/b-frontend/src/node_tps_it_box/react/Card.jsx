import MyButton from './Button'

const Title = () => {
    return <h1>INI adalah judul</h1>;
};
  
const Content = () => {
    return <p>Content ini adalah naus</p>;
};
  
const Card = () => {
    return (
        <div className="card">
        <Title />
        <Content />
        <MyButton />
        </div>
    );
};

export default Card;
  