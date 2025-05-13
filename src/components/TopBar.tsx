import "components/styles/TopBar.scss"
import Button from "./Button"

interface Props {
    
}

export default function TopBar (props: Props) {

    const handleOnSignUpClick = () => {

    }

    return (
        <header>
            <nav className="navbar">
                <div className="logo">SkillAssess</div>
                <ul className="nav-links">
                    {/* <li><a href="#">Products</a></li>
                    <li><a href="#">Solutions</a></li>
                    <li><a href="#">Resources</a></li>
                    <li><a href="#">Pricing</a></li> */}
                </ul>
                <div className="nav-buttons">
                    <Button onClick={handleOnSignUpClick} size={"md"}>
                        Sign up
                    </Button>
                </div>
            </nav>
        </header>
    )
}