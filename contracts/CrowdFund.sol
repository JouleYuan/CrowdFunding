// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "./Project.sol";

contract CrowdFunding {
    Project[] private projects;
    
    event ProjectCreated(
        address contractAddress,
        address projectCreator,
        string projectTitle,
        string projectDescription,
        uint256 projectTarget,
        uint256 projectStartTime,
        uint256 projectDeadline
    );

    function createProject(
        string calldata title,
        string calldata description,
        uint256 duration,
        uint256 target
    ) external {
        uint256 startTime = block.timestamp;
        uint256 deadline = startTime + duration * 1 days;
        Project newProject = new Project(msg.sender, title, description, target, startTime, deadline);
        projects.push(newProject);
        emit ProjectCreated(
            address(newProject),
            msg.sender,
            title,
            description,
            target,
            startTime,
            deadline
        );
    }

    function getProjects() external view returns(Project[] memory){
        return projects;
    }
}
