<?php
class Tree {

	public $node = [];

	/**
	 * 
	 * Builds a nested array of elements
	 * @param array $elements
	 * @param int $parentId
	 * @param string $id - Default parent id
	 * @return array
	 */
	public function build(array $elements, $parentId = 0, $id = 'id') {
		$branch = array();
	
		foreach ($elements as $element) {
			if(is_array($element))
			{
				if ($element['parent_id'] == $parentId) {
					$children = build($elements, $element[$id], $id);
					if ($children) {
						$element['children'] = $children;
					}
					$branch[] = $element;
				}
			}
			elseif(is_object($element)){
				if ($element->parent_id == $parentId) {
					$children = build($elements, $element->$id, $id);
					if ($children) {
						$element->children = $children;
					}
					$branch[] = $element;
				}
			}
		}

		return $branch;
	}


	/** 
	 * Generates sequence for nested array
	 * @param array $elements
	 * @param int $parentId
	 * 
	 * @return array
	 */
	public function generateSequence(array &$elements, $parentId = 1)
	{	
		foreach($elements as $key => &$element)
		{
			if(is_array($element))
			{
				if($element['parent_id'] != NULL)
				{
					$parent_id = $parentId . '.' . ($key + 1);
				}
				else
				{
					$parent_id = ($key + 1);
				}
				
				$element['sequence'] = $parent_id;
				
				if(isset($element['children']))
				{
					generateSequence($element['children'], $parent_id);
				}
			}
			elseif(is_object($element))
			{
				if($element->parent_id != NULL)
				{
					$parent_id = $parentId . '.' . ($key + 1);
				}
				else
				{
					$parent_id = ($key + 1);
				}
				
				$element->sequence = $parent_id;
				
				if(isset($element->children))
				{
					generateSequence($element->children, $parent_id);
				}
			}
		}

		return $elements;
	}


	/**
	 * Flattens an children nodes to a single level array
	 * @param array $array - multidimensional array to flatten
	 * @param string $children_col - column name of 
	 * @return array 
	 */
	public function flatten($array, $children_col = 'children') 
	{
		$dest = [];
	
		foreach ($array as $key => $value) {
			if (is_array($value)) {
				$tmp = (isset($value[$children_col])) ? $value[$children_col] : [];
				unset($value[$children_col]);
				$dest[] = $value;
	
				if (isset($tmp) && is_array($tmp) && !empty($tmp)) {
					$dest = array_merge($dest, flatten($tmp));
				}
			} elseif (is_object($value)) {
				$tmp = (isset($value->{$children_col})) ? $value->{$children_col} : [];
				unset($value->{$children_col});
				$dest[] = $value;
	
				if (isset($tmp) && is_array($tmp) && !empty($tmp)) {
					$dest = array_merge($dest, flatten($tmp));
				}
			}
		}
	
		return $dest;
	}

}