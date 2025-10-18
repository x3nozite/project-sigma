interface Props {
  onclick: () => void;
}

const DescriptionForm = ({ onclick }: Props) => {
  return (
    <div>test
      <button onClick={onclick}>close</button>
    </div>
  )
}

export default DescriptionForm
